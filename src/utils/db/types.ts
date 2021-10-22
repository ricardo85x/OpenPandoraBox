export interface IRom {
    platform: string
    id: number,
    name: string,
    path: string,
    thumbnail: string,
    image: string,
    video: string,
    desc: string,
    romName: string
    normalizedName: string
}

export interface IHistory {
    romId: number
    platform: string
    updated_at: string
}

export interface IFavorites {
    romId: number
    platform: string
    updated_at: string
}

