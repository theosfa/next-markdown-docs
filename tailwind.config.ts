import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // if you have a `src/` folder:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {
  //     typography: {
  //       DEFAULT: {
  //         css: {
  //           color: '#1f2937', // same as gray.800
  //           h1: { fontSize: '1.875rem' }, // same as text-3xl
  //           h2: { fontSize: '1.5rem' },   // same as text-2xl
  //           a: {
  //             color: '#2563eb', // same as blue.600
  //             '&:hover': {
  //               textDecoration: 'underline',
  //             },
  //           },
  //           code: {
  //             backgroundColor: '#f3f4f6', // gray.100
  //             padding: '2px 4px',
  //             borderRadius: '4px',
  //             fontSize: '0.85em',
  //           },
  //           'pre code': {
  //             background: 'none',
  //             padding: 0,
  //             borderRadius: 0,
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
  theme: { extend: {} },
  plugins: [typography],
};

export default config;

