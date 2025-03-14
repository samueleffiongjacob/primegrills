
import { useState } from 'react';

type Category = {
  id: string;
  name: string;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQs = {
  [key: string]: FAQItem[];
};

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories: Category[] = [
    { id: 'general', name: 'General Information' },
    { id: 'reservations', name: 'Reservations' },
    { id: 'menu', name: 'Menu & Dietary Needs' },
    { id: 'delivery', name: 'Delivery & Pickup' },
    { id: 'events', name: 'Events & Catering' },
  ];

  const faqs: FAQs = {
    general: [
      {
        id: 'hours',
        question: 'What are your hours of operation?',
        answer: 'We are open Tuesday through Sunday. Lunch is served from 11:00 AM to 2:30 PM, and dinner from 5:00 PM to 10:00 PM. We are closed on Mondays for staff rest and kitchen preparation.'
      },
      {
        id: 'location',
        question: 'Where are you located and is parking available?',
        answer: 'We are located at 123 Cuisine Street in Downtown. We offer complimentary valet parking for dinner guests. There is also a public parking garage one block away on Main Street.'
      },
      {
        id: 'dresscode',
        question: 'Is there a dress code?',
        answer: 'We maintain a smart casual dress code. While formal attire is not required, we ask that guests refrain from wearing athletic wear, beachwear, or overly casual attire like flip-flops or tank tops.'
      },
      {
        id: 'kids',
        question: 'Are children welcome?',
        answer: 'Absolutely! We welcome guests of all ages. We offer a children\'s menu and high chairs. For the comfort of all guests, we simply ask that parents supervise their children during their visit.'
      }
    ],
    reservations: [
      {
        id: 'make-reservation',
        question: 'How do I make a reservation?',
        answer: 'Reservations can be made online through our website, by phone at +234801234567, or through our partnered reservation platforms. We recommend booking at least a week in advance for weekend dining.'
      },
      {
        id: 'cancel-reservation',
        question: 'What is your cancellation policy?',
        answer: 'We request at least 24 hours notice for cancellations. Cancellations with less notice or no-shows may be subject to a fee of $25 per person for special events or peak dining times.'
      },
      {
        id: 'large-party',
        question: 'Can I make a reservation for a large party?',
        answer: 'Yes! We can accommodate parties of up to 20 people in our main dining room. For groups larger than 8, please contact us directly at (555) 123-4567 to discuss menu options and any special arrangements.'
      },
      {
        id: 'wait-time',
        question: 'What is the wait time for walk-ins?',
        answer: 'Wait times vary depending on the day and time. Weekends and peak dinner hours (6:30-8:30 PM) typically have a 45-90 minute wait without a reservation. We offer a comfortable bar area where you can enjoy drinks and appetizers while waiting.'
      }
    ],
    menu: [
      {
        id: 'menu-change',
        question: 'How often does your menu change?',
        answer: 'Our core menu changes seasonally four times a year to incorporate the freshest ingredients. We also offer daily specials that highlight unique ingredients and chef inspirations.'
      },
      {
        id: 'dietary',
        question: 'Can you accommodate dietary restrictions?',
        answer: 'Yes, we pride ourselves on accommodating dietary needs. We offer vegetarian, vegan, gluten-free, and dairy-free options. Please inform your server about any allergies or restrictions, and our chefs will be happy to make appropriate modifications when possible.'
      },
      {
        id: 'wine-pairing',
        question: 'Do you offer wine pairings with meals?',
        answer: 'Absolutely! Our sommelier has created perfect wine pairings for each main course, available by the glass or bottle. We also offer a wine flight option that allows you to sample multiple wines with your meal.'
      },
      {
        id: 'ingredients',
        question: 'Where do you source your ingredients?',
        answer: "We're committed to sustainability and supporting local agriculture. Most of our produce comes from farms within 100 miles of our restaurant, and our seafood is sustainably sourced. We're happy to share information about specific ingredients upon request."
      }
    ],
    delivery: [
      {
        id: 'delivery-area',
        question: 'What areas do you deliver to?',
        answer: 'We deliver within a 5-mile radius of our restaurant. You can check if your address is within our delivery zone by entering your zip code on our online ordering platform.'
      },
      {
        id: 'delivery-fee',
        question: 'Is there a delivery fee?',
        answer: 'We charge a $5 delivery fee for orders under $50. Delivery is complimentary for orders over $50. During peak hours or inclement weather, delivery times may be extended.'
      },
      {
        id: 'pickup-process',
        question: 'How does pickup work?',
        answer: "After placing your order online or by phone, you'll receive a confirmation with an estimated pickup time. Upon arrival, please park in one of our designated pickup spots and call the number provided in your confirmation. A staff member will bring your order directly to your car."
      },
      {
        id: 'takeout-menu',
        question: 'Is your full menu available for takeout?',
        answer: "Most of our menu is available for takeout, but a few select dishes that don't travel well are excluded. Our online ordering system shows all available takeout options, including daily specials designed specifically for takeout."
      },
      {
        id: 'preorder',
        question: 'Can I place an order in advance?',
        answer: 'Yes! You can place delivery or pickup orders up to 7 days in advance through our website. This is especially helpful for planning special occasions or business lunches.'
      }
    ],
    events: [
      {
        id: 'private-events',
        question: 'Do you host private events?',
        answer: 'Yes, we have a beautiful private dining room that can accommodate up to 40 guests for seated dinners and up to 60 for standing receptions. We offer customized menus and service options for all types of events.'
      },
      {
        id: 'catering',
        question: 'Do you offer off-site catering?',
        answer: 'We provide catering services for events ranging from intimate gatherings to large celebrations. Our catering menu features many of our restaurant favorites adapted for event service, and we can create custom menus for your specific needs.'
      },
      {
        id: 'event-cost',
        question: 'What is the cost for a private event?',
        answer: 'Private event pricing varies based on the day of the week, time of day, number of guests, and menu selections. We require a minimum food and beverage spend, which our events coordinator will discuss with you during consultation.'
      },
      {
        id: 'booking-lead',
        question: 'How far in advance should I book for an event?',
        answer: 'For private dining, we recommend booking at least 2-3 weeks in advance for smaller groups and 1-3 months for larger events. Peak season (holidays, graduation season) may require even more advance notice. For off-site catering, we recommend 1-2 months advance booking.'
      }
    ]
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h1>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#EE7F61] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs[activeCategory]?.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <button
                className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-[#EE7F61] focus:ring-opacity-50"
                onClick={() => toggleItem(faq.id)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openItems[faq.id] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openItems[faq.id] && (
                <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-2">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
