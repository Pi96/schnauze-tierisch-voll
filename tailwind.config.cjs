/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
'./src/**/*.{astro,html,js,jsx,ts,tsx}'
],
theme: {
extend: {
colors: {
brand: {
primary: '#CB9866',
pale: '#D6D9CD'
}
},
borderRadius: { 'xl2': '1.25rem' }
}
},
plugins: []
};
