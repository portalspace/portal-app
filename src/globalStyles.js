import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-size: 1rem;
    color: white;
    font-family: 'Rubik';
    font-weight: 400;

    background: #0D121D;
    background-image: url("/images/background.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center bottom;
  }

  button {
    all: unset;
    cursor: pointer;
    padding: 0px;
  }

  html {
    /* Font varient */
    font-variant-ligatures: none;
    -webkit-font-variant-ligatures: none;
    /* Smoothing */
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    text-shadow: rgba(0, 0, 0, .01) 0 0 1px;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  /* SCROLLBAR */
  /* hide scrollbar but allow scrolling */
  * {
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    overflow-y: scroll;
  }

  *::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  /* END OF SCROLLBAR */
`

export default GlobalStyle
