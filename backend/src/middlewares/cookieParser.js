module.exports = (req, res, next) => {
  const list = {};
  const cookieHeader = req.headers?.cookie;

  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      let [name, ...rest] = cookie.split('=');
      name = name?.trim();
      if (!name) return;
      const value = rest.join('=').trim();
      if (!value) return;
      try {
        list[name] = decodeURIComponent(value);
      } catch {
        list[name] = value;
      }
    });
  }

  req.cookies = list;
  next();
};
