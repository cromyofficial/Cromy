import Container from "@/components/Container";
import React from "react";

const AboutPage = () => {
  return (
    <Container className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          About <span className="text-blue-600">Cromy</span>
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm">
          Premium denim crafted with passion, precision, and purpose.
        </p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 lg:p-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Story
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Cromy was founded by <span className="font-medium text-gray-800">Shan Mohammad</span>, 
          who recognized a clear gap in the denim market — premium jeans were either 
          too expensive or lacked the quality customers truly deserved. With a vision 
          to create high–quality jeans at honest pricing, Cromy was born.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why We Started
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          After years of observing the fashion industry, Shan realized that 
          consumers often had to choose between comfort and affordability. 
          Premium denim felt like a luxury, not a standard. Cromy set out to 
          change that by offering jeans crafted from <span className="font-medium">high-grade 
          denim fabric blended with lycra</span> — delivering stretch, durability, and 
          everyday comfort.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What We Stand For
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Every pair of Cromy jeans is designed with precision, modern styling, 
          and long-lasting quality. Our mission is simple —
          <span className="font-medium"> premium denim for everyone</span>. We’re dedicated to 
          honest craftsmanship, fair pricing, and elevating everyday wear with 
          comfort and confidence.
        </p>

        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <p className="text-blue-700 text-center font-medium">
            “Great denim should not be a luxury — it should be a standard.”
          </p>
        </div>
      </div>
    </Container>
  );
};

export default AboutPage;
