export type FediInvite = {
  id: 'federation' | 'community'
  title: string
  description: string
  code: string
  imageSrc: string
  imageAlt: string
  copyLabel: string
}

export const FEDI_INVITES: FediInvite[] = [
  {
    id: 'federation',
    title: '1. Join Afribit Federation',
    description:
      'Start by joining Afribit\'s federation. Scan the QR code with Fedi, or copy the federation code and paste it into the app on the same device.',
    code: 'fed11qgqyj3mfwfhksw309ucrxe35vgcryvesxf3nyepsv3jnyepsvgcnxdpjv5urjcfkv4nrydmxxvervef3xcmxxce5x5ergwfnxcukzetr8qen2vnpvsmr2vrzqyqjplegdfhg4qq8f0zeuvjxn8e49sa3tnep7w08dca79wecgjkyszrufgwesp',
    imageSrc: '/Images/Fedi/federation qr code.jpeg',
    imageAlt: 'Scan to join the Afribit Fedi Federation',
    copyLabel: 'Copy federation code',
  },
  {
    id: 'community',
    title: '2. Join Fedi Community',
    description:
      'Then join the Afribit community space. Scan the QR code with Fedi, or copy the community code and paste it into the app on the same device.',
    code: 'fedi:community210v3xzat5dphhyhmsw43xketeygazydfkx5mnjepk8yersv34xyurvcmpxvexxwf4x9jxvetzxajkyd3hxsmxge3nxucrjvf4893rzcfkve3njcnxx93nwwt9v33xydtzxgezytpzvdhk6mt4de5hg72lw46kjezldpjhsg36yfjkydmyvvmxywpnvdjx2wpcxyerwepsxgckvwp3xs6x2c3cxycrzvf3vgekge3hxu6xxc33xs6kvvtz8qckvdf58y6xxefev5enzet9ygkzyer9vde8jur5d9hkuhmtv4ujyw3z24cxz52g89jxg33t2dzn2wr4datrja3cd3h8q7n3xschsejhgye923nvve582mpcwg6hx0fz05zvac43',
    imageSrc: '/Images/Fedi/fedi community qr code.jpeg',
    imageAlt: 'Scan to join the Afribit Fedi Community',
    copyLabel: 'Copy community code',
  },
]