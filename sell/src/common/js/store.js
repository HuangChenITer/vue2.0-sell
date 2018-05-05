export function saveToLocal(id, key, value) {
  // 只有运行到浏览器环境才有localStorage，且文件结尾有新行
  let seller = window.localStorage.__seller__;
  if (!seller) {
    // 如果之前没有这个seller，则设置为空对象
    seller = {};
    seller[id] = {};
    // 每个id都是单独一个obj
  } else {
    seller = JSON.parse(seller);
    // 如果有的话，解析成对象
    if (!seller[id]) {
      seller[id] = {};
    }
    // 虽然有，但是不是当前id对应的，也设置为空对象
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller[id]) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
