import { db, jettons, jettonsMeta } from '@/shared/database'

async function seed() {
  await db.transaction(async (tx) => {
    await tx.insert(jettons).values([
      {
        address: 'EQC93bvqv6c8x6BPnrAIqk3nAiP8jph38h3YKM5DLGPnvqMC',
        name: 'COCOS',
        symbol: 'COCOS',
        description: 'Cocos token test',
        image: null,
        minter: '0QCjj6kVHfAve2jhcQJ_7cM9Magsk1WaSCL5UWoC4CgZPgBR',
      },
      {
        address: 'EQDwcgVxLS4reLhkLK0UhefmqSKl6hSDWJq45qhKmlmuLz8O',
        name: 'FLY',
        symbol: 'FLY',
        description: '',
        image: null,
        minter: '0QCjj6kVHfAve2jhcQJ_7cM9Magsk1WaSCL5UWoC4CgZPgBR',
      },
      {
        address: 'EQAYfjRZle00t1ADwbr2NyTBZyYlf07JgmmgStlsydFbdIrR',
        name: 'GOOO',
        symbol: 'GOO',
        description: '',
        image: 'https://cdn.sunpump.meme/public/logo/GOKU_TEW71u_O1eiYMiRWcrt.jpeg',
        minter: '0QCjj6kVHfAve2jhcQJ_7cM9Magsk1WaSCL5UWoC4CgZPgBR',
      },
      {
        address: 'EQDkiIj2laJ5kHO_AfahAbV893cRdA2QZWT-aZPkjkXPY3Ds',
        name: 'OLO',
        symbol: 'OLO',
        description: '',
        image: null,
        minter: '0QCjj6kVHfAve2jhcQJ_7cM9Magsk1WaSCL5UWoC4CgZPgBR',
      },
      {
        address: 'EQCvO_b8yaCbzFR1Cn42bGH-ALzExfd42GalL_pG2mxGxFE4',
        name: 'BUBA',
        symbol: 'BUBA',
        description: '',
        image: null,
        minter: '0QCjj6kVHfAve2jhcQJ_7cM9Magsk1WaSCL5UWoC4CgZPgBR',
      },
      {
        address: 'EQDfTBEUegotQoObGj8NNgHRETalR-RtrfaJfSXRwFiPJtJG',
        name: 'BTC',
        symbol: 'BTC',
        description: 'BTC',
        image: '',
        minter: '0QCjj6kVHfAve2jhcQJ_7cM9Magsk1WaSCL5UWoC4CgZPgBR',
      },
    ])

    await tx.insert(jettonsMeta).values([
      {
        id: 1,
        jettonId: 1,
        website: '',
        twitter: '',
        telegram: '',
      },
      {
        id: 2,
        jettonId: 2,
        website: 'https://sungoku.org/',
        twitter: 'https://x.com/Sun_Goku_Tron',
        telegram: 'https://t.me/SunGokuCoinTron',
      },
      {
        id: 3,
        jettonId: 3,
        website: 'https://sungoku.org/',
        twitter: 'https://x.com/Sun_Goku_Tron',
        telegram: 'https://t.me/SunGokuCoinTron',
      },
      { id: 4, jettonId: 4, website: '', twitter: '', telegram: '' },
      { id: 5, jettonId: 5, website: '', twitter: '', telegram: '' },
      {
        id: 6,
        jettonId: 6,
        website: 'https://sungoku.org/',
        twitter: 'https://x.com/Sun_Goku_Tron',
        telegram: 'https://t.me/SunGokuCoinTron',
      },
    ])

    console.log('Database seeded')
  })
}

seed()
  .catch((error) => {
    console.error('Database seeding failed', error)
    process.exit(1)
  })
  .finally(() => {
    console.log('Database seeding finished. Exiting...')
    process.exit(0)
  })
