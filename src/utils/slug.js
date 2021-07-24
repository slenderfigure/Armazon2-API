const slug = txt => {
  return txt
    .trim()
    .toLowerCase()
    .replace(/["'&^$%#@!;:,/?`~#*_+={}\[\]\.\|\(\)]/g, '')
    .replace(/\s/g, '-')
    .replace(/--/g, '')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

module.exports = slug;