import Container from "@/components/Container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Title } from "@/components/ui/Title";
import { faqsData } from "@/constant";

import React from "react";

const FaqsPage = () => {
  return(
     <Container className="max-w-4xl sm:px-6 lg:px-8 py-12">
      <Title className="text-3xl">Frequently Asked Questions </Title>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {faqsData?.map((faq,index)=>(
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-semibold
             text-[#151515]/80 group-hover:text-[#151515] 
             hover:no-underline hoverEffect">
              {faq?.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq?.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
  </Container>
  );
};

export default FaqsPage;
