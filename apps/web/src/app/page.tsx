import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/images/alfa-manager.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-cyan-600">Creative</span>
          </div>
          <nav>
            <ul className="flex space-x-2 items-center">
              <li>
                <Button asChild variant={"ghost"}>
                  <Link href="/login">
                   Login
                  </Link>
                </Button>
              </li>
              <li>
                <Button asChild variant={"default"} className="bg-cyan-600">
                  <Link href="/register">
                    Sign-up
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-cyan-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Boost Your Facebook Advertising with Our Business Manager Service
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your campaigns, maximize ROI, and scale your business effortlessly.
            </p>
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-full">
              Get Started Now
            </Button>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Choose Our Business Manager Service?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Campaign Management",
                  description:
                    "Our team of seasoned professionals will optimize your campaigns for maximum performance.",
                },
                {
                  title: "Advanced Analytics",
                  description:
                    "Gain deep insights into your audience and campaign performance with our cutting-edge analytics tools.",
                },
                {
                  title: "Scalable Solutions",
                  description:
                    "Whether you're a small business or a large enterprise, our solutions grow with your needs.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <CheckCircle className="text-green-500 w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$99/month",
                  features: ["Basic campaign management", "Weekly reporting", "Email support"],
                },
                {
                  name: "Professional",
                  price: "$299/month",
                  features: [
                    "Advanced campaign optimization",
                    "Daily reporting",
                    "Priority email & chat support",
                    "Custom audience creation",
                  ],
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  features: [
                    "Full-service account management",
                    "Real-time reporting",
                    "24/7 dedicated support",
                    "Custom strategy development",
                  ],
                },
              ].map((plan, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-4xl font-bold text-cyan-600 mb-6">{plan.price}</p>
                  <ul className="text-left mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center mb-2">
                        <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full w-full">
                    Choose Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Ready to Get Started?</h2>
            <div className="max-w-md mx-auto">
              <form className="space-y-4">
                <Input type="text" placeholder="Your Name" className="w-full" />
                <Input type="email" placeholder="Your Email" className="w-full" />
                <Input type="text" placeholder="Your Company" className="w-full" />
                <textarea
                  placeholder="How can we help you?"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={4}
                ></textarea>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Creative. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

