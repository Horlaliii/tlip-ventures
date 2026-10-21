# Fonts

`inter-latin-cedi.woff2` is Inter 4.1 (variable weight 100–900, SIL Open Font
License, see `Inter-OFL.txt`) cut down to Google Fonts' Latin character set plus
the cedi sign ₵ (U+20B5). Google's Latin subset has no ₵, so every price made
browsers download an extra 83 KB "latin-ext" file; this one file covers both.

Made from the `inter-ui` npm package with fontTools:

    pyftsubset InterVariable.woff2 --flavor=woff2 \
      --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+20B5,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
      --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk,case,tnum" --output-file=subset.woff2
    fonttools varLib.instancer subset.woff2 opsz=14 -o pinned.ttf
    pyftsubset pinned.ttf --unicodes="*" --flavor=woff2 \
      --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk,case,tnum" --output-file=inter-latin-cedi.woff2
