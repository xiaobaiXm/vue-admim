export interface Cache<V = any> {
  value?: V
  timeoutId?: ReturnType<typeof setTimeout>
  time?: number
  alive?: number
}
const NOT_ALIVE = 0
export class Memory<V = any, T = any> {
  private cache: { [key in keyof T]?: Cache<V> } = {}
  private alive: number
  constructor(alive = NOT_ALIVE) {
    this.alive = alive * 1000
  }
  get getCache(): Cache {
    return this.cache
  }
  setCache(cache): void {
    this.cache = cache
  }
  resetCache(cache: { [K in keyof T]: Cache }) {
    Object.keys(cache).forEach((key) => {
      const k = key as any as keyof T
      const item = cache[k]
      if (item && item.time) {
        const now = new Date().getTime()
        const expire = item.time
        if (expire > now) {
          this.set(k, item.value, expire)
        }
      }
    })
  }
  get<K extends keyof T>(key: K): Cache<V> | undefined {
    return this.cache[key]
  }
  set<K extends keyof T>(key: K, value: V, expires?: number): V {
    const now = new Date().getTime()
    let item = this.get(key)
    if (!expires || (expires as number) <= 0) expires = this.alive
    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId)
        item.timeoutId = undefined
      }
    } else {
      item = { value, alive: expires }
      this.cache[key] = item
    }
    if (!expires) return value
    item.time = expires > now ? expires : expires + now
    item.timeoutId = setTimeout(
      () => {
        this.remove(key)
      },
      expires > now ? expires - now : expires
    )
    return value
  }
  remove<K extends keyof T>(key: K): V | undefined {
    const item = this.get(key)
    Reflect.deleteProperty(this.cache, key)
    if (item) {
      clearTimeout(item.timeoutId!)
      return item.value
    }
  }
  clear(): void {
    Object.keys(this.cache).forEach((key: string) => {
      const item = this.cache[key]
      item.timeoutId && clearTimeout(item.timeoutId)
    })
    this.cache = {}
  }
}
