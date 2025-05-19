import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  productSchema, 
  contactSchema, 
  newsletterSchema,
  cartItemSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      res.status(500).json({ message: "Failed to get product" });
    }
  });

  // Contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const contact = await storage.createContactMessage(contactData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  // Newsletter subscriptions
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriptionData = newsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscription = await storage.getNewsletterSubscriptionByEmail(subscriptionData.email);
      if (existingSubscription) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating newsletter subscription:", error);
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });

  // Shopping cart
  app.post("/api/cart/add", async (req, res) => {
    try {
      const { productId } = cartItemSchema.parse(req.body);
      
      // Generate a cart ID if one doesn't exist in the session
      const cartId = req.session?.cartId || Date.now();
      if (!req.session?.cartId) {
        req.session.cartId = cartId;
      }
      
      // Get product to add to cart
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const cartItem = await storage.addToCart(cartId, productId);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ message: "Invalid cart data" });
    }
  });

  app.get("/api/cart", async (req, res) => {
    try {
      const cartId = req.session?.cartId;
      
      if (!cartId) {
        // If no cart ID exists, return an empty cart
        return res.json({ id: 0, items: [], total: 0 });
      }
      
      const cart = await storage.getCart(cartId);
      res.json(cart || { id: cartId, items: [], total: 0 });
    } catch (error) {
      console.error("Error getting cart:", error);
      res.status(500).json({ message: "Failed to get cart" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
