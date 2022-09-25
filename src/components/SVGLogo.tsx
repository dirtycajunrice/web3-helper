import {ReactNode} from "react";

const SVGLogo = (name: string, symbol: string): ReactNode => {
  return (
    <img src={`https://cryptologos.cc/logos/${name.toLowerCase()}-${symbol.toLowerCase()}-logo.svg`} alt="asdf" />
  )
}

export default SVGLogo;
