import { faker } from "@faker-js/faker";

const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const degrees = ["MD", "PhD", "MSW", "PsyD", "LCSW", "LPC", "LMFT"];

// Function to generate random specialties (2-5 specialties per advocate)
const getRandomSpecialties = () => {
  const count = faker.number.int({ min: 2, max: 5 });
  const shuffled = [...specialties].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to generate a single advocate
const generateAdvocate = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  city: faker.location.city(),
  degree: faker.helpers.arrayElement(degrees),
  specialties: getRandomSpecialties(),
  yearsOfExperience: faker.number.int({ min: 1, max: 30 }),
  phoneNumber: parseInt(faker.string.numeric(10)),
});

// Generate 500 advocates (configurable)
const ADVOCATE_COUNT = 500;

const advocateData = Array.from({ length: ADVOCATE_COUNT }, generateAdvocate);

export { advocateData };
