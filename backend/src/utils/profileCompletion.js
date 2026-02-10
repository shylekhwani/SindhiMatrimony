const REQUIRED_FIELDS = [
  "name",
  "gender",
  "dateOfBirth",
  "height",
  "education",
  "profession",
  "city",
  "country",
  "aboutMe",
  "partnerAgeMin",
  "partnerAgeMax",
];

const ALL_TRACKED_FIELDS = [
  // Personal
  "name",
  "gender",
  "dateOfBirth",
  "timeOfBirth",
  "placeOfBirth",
  "height",
  "weight",
  "maritalStatus",
  "complexion",
  "bodyType",
  "diet",
  "drinking",
  "smoking",
  "aboutMe",
  "hobbies",
  "languages",

  // Professional
  "education",
  "educationDetails",
  "profession",
  "organization",
  "annualIncome",
  "city",
  "state",
  "country",

  // Partner preferences
  "partnerAgeMin",
  "partnerAgeMax",
  "partnerHeightMin",
  "partnerHeightMax",
  "partnerEducation",
  "partnerProfession",
  "partnerLocation",
];

export function calculateProfileCompletion(profile) {
  let filled = 0;

  ALL_TRACKED_FIELDS.forEach((field) => {
    if (profile[field]) filled++;
  });

  const percentage = Math.round((filled / ALL_TRACKED_FIELDS.length) * 100);

  const isCompleted = REQUIRED_FIELDS.every((field) => !!profile[field]);

  return {
    percentage,
    isCompleted,
  };
}
