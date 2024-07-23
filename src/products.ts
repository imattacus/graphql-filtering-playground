interface Product {
  id: number
  name: string
  price: number
  provider: string
  downloadSpeed: number
  uploadSpeed: number
  services: { broadband: { linetype: string, fast: boolean }, tv: { channels: number } }
}

export const products: Product[] = [
  {
    id: 1, name: "Product 1 Sky £100 100 down 100 up", price: 100, downloadSpeed: 100, uploadSpeed: 100, provider: "Sky",
    services: {
      broadband: {
        linetype: "fibre",
        fast: true
      },
      tv: {
        channels: 100
      }
    }
  },
  { id: 2, name: "Product 2 Sky £200 100 down 50 up", price: 200, downloadSpeed: 100, uploadSpeed: 50, provider: "Sky",
    services: {
      broadband: {
        linetype: "fibre",
        fast: true
      },
      tv: {
        channels: 100
      }
    }
  },
  { id: 3, name: "Product 3 Plusnet £50 25 down 5 up", price: 50, downloadSpeed: 25, uploadSpeed: 5, provider: "Plusnet",
    services: {
      broadband: {
        linetype: "fibre",
        fast: true
      },
      tv: {
        channels: 100
      }
    }
   },
  { id: 4, name: "Product 4 Plusnet £100 100 down 90 up", price: 100, downloadSpeed: 100, uploadSpeed: 90, provider: "Plusnet",
    services: {
      broadband: {
        linetype: "cable",
        fast: true
      },
      tv: {
        channels: 100
      }
    }
   },
  { id: 5, name: "Product 5 Vodafone £70 90 down 90 up", price: 70, downloadSpeed: 90, uploadSpeed: 90, provider: "Vodafone",
    services: {
      broadband: {
        linetype: "5g",
        fast: true
      },
      tv: {
        channels: null
      }
    }
   },
  { id: 6, name: "Product 6 Vodafone £10 5 down 5 up", price: 10, downloadSpeed: 5, uploadSpeed: 5, provider: "Vodafone",
    services: {
      broadband: {
        linetype: "fibre",
        fast: false
      },
      tv: {
        channels: 10
      }
    }
   }
]