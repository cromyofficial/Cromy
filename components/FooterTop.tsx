import React from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "6231/6, gali no.1, clubmen gali,dev nagar,karol bagh, Delhi-110005",
    icon: (
      <MapPin className="h-6 w-6 text-gray-600 group-hover:text-darkColor transition-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+91 9582 4833 53",
    icon: (
      <Phone className="h-6 w-6 text-gray-600 group-hover:text-darkColor transition-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "tue - Sun: 10:00 AM - 8:00 PM",
    icon: (
      <Clock className="h-6 w-6 text-gray-600 group-hover:text-darkColor transition-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "CromyOfficial@gmail.com",
    icon: (
      <Mail className="h-6 w-6 text-gray-600 group-hover:text-darkColor transition-colors" />
    ),
  },
];

export const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data.map((item, index) => (
        <ContactItem
          key={index}
          icon={item.icon}
          title={item.title}
          content={item.subtitle}
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const ContactItem = ({ icon, title, content }: ContactItemProps) => {
  return (
    <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors">
      {icon}
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-darkColor transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">
          {content}
        </p>
      </div>
    </div>
  );
};
