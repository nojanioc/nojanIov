import "next";

declare module "next" {
  interface NextApiRequest {
    user?: { [key: string]: any }; // Define the 'user' property
  }
}
