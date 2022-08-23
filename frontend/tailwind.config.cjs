/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily:{
        lato:"'Lato','sans-serif'",
        audiowide:"'Audiowide','cursive'",
        fredoka:"'Fredoka One', cursive"
      },
      colors:{
        'color1':'#7474bf',
        'color2':'#348ac7'
      }
    },
  },
  plugins: [],
}
