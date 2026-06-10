export const users = Array.from(
  { length: 1000 },
  (_, index) => ({
    userId: index + 1,

    userName: `User ${index + 1}`,

    email: `user${index + 1}@gmail.com`,

    department:
      index % 2 === 0
        ? "IT"
        : "Security",
  })
);