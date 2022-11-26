/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        appBarBg: '#FFFFFF',
        mainBg: '#F7F8F9',
        questionCardBg: '#F9F9F9',
        textAreaBorder: "#EEEEEE",
        errorText: "#F16063",
        green:{
          27:'#27AE60'
        },
      },
    }
  },
  variants: {
    extend: {
      border: ['last', 'odd', 'first', 'even'],
    },
  },
  plugins: [],
}
