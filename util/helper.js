export function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export function isValidURL(string) {
  try {
    new URL(string); // Try to create a URL object
    return true;
  } catch (err) {
    return false; // If an error is thrown, it's not a valid URL
  }
}
