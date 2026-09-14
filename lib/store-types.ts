export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export type RestaurantTable = {
  id: string
  name: string
  seats: number
}

export type Settings = {
  restaurantName: string
  tagline: string
  logo: string
}

export type AppData = {
  menu: MenuItem[]
  tables: RestaurantTable[]
  settings: Settings
}

export const DEFAULT_DATA: AppData = {
  settings: {
    restaurantName: 'Arrow Hub',
    tagline: 'Fine Dining',
    logo: '/arrow-hub-logo.png',
  },
  tables: [
    { id: 't1', name: 'Table 1', seats: 2 },
    { id: 't2', name: 'Table 2', seats: 4 },
    { id: 't3', name: 'Table 3', seats: 4 },
    { id: 't4', name: 'Terrace 1', seats: 6 },
    { id: 't5', name: 'Private Booth', seats: 8 },
  ],
  menu: [
    {
      id: 'm1',
      name: 'Paneer Tikka',
      description: 'Char-grilled cottage cheese, mint chutney, pickled onion.',
      price: 320,
      category: 'Starters',
      available: true,
    },
    {
      id: 'm2',
      name: 'Tandoori Prawns',
      description: 'Jumbo prawns marinated in yogurt and smoked spices.',
      price: 640,
      category: 'Starters',
      available: true,
    },
    {
      id: 'm3',
      name: 'Butter Chicken',
      description: 'Slow-cooked chicken in a silky tomato and cashew gravy.',
      price: 480,
      category: 'Main Course',
      available: true,
    },
    {
      id: 'm4',
      name: 'Dal Makhani',
      description: 'Black lentils simmered overnight with butter and cream.',
      price: 360,
      category: 'Main Course',
      available: true,
    },
    {
      id: 'm5',
      name: 'Hyderabadi Biryani',
      description: 'Fragrant basmati, saffron, and slow-cooked lamb.',
      price: 520,
      category: 'Main Course',
      available: true,
    },
    {
      id: 'm6',
      name: 'Gulab Jamun',
      description: 'Warm milk dumplings soaked in cardamom syrup.',
      price: 220,
      category: 'Desserts',
      available: true,
    },
    {
      id: 'm7',
      name: 'Masala Chai',
      description: 'Spiced Assam tea brewed with fresh ginger.',
      price: 120,
      category: 'Beverages',
      available: true,
    },
  ],
}
