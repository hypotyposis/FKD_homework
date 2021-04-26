class IdManager {
    constructor () {
      this.id = 0
    }
  
    getId () {
      this.id++
      return this.id
    }
}
  
export default {
    IdManager: IdManager,
}