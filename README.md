<div align=center>

# 🛡️ resguard

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]

</div>

`resguard` is a tiny utility that wraps promises and returns an object or tuple with `data` and `error` properties. It's useful for handling errors in async functions without having to use `try/catch` blocks.

## highlights

- 🛡 Wraps promises and returns an object or tuple with data and error properties
- 🎯 TypeScript support with type checking
- 🛠️ Custom error handling support
- ⚡ Minimal dependencies and small bundle size

## usage

```bash
npm install resguard
```

```typescript
import { resguard } from 'resguard'

async function fetchData() {
    const client = new APIClient()

    const items = await resguard(client.getItems())
    if (items.error) 
        handle(items.error)
    
    const updated = await resguard(client.updateItems(items.data))
    if (updated.error) 
        handle(updated.error)

    return updated.data
}
```
<sup><strong>Both the `data` and `error` properties of the result are correctly typed</strong></sup>

```typescript
import { resguard } from 'resguard'

const result = await resguard(() => {
    if (Math.random() > 0.5) 
        return true
    else 
        throw new Error('Something went wrong')
})

if (result.error) 
    handle(result.error)
```
<sup><strong>`resguard` can also be used with functions.</strong></sup>

```typescript
import { resguard } from 'resguard'

const result = await resguard(async () => {
    const client = new APIClient()
    const items = await client.getItems()
    return items.map(item => item.id)
})

if (result.error) 
    handle(result.error)
```
<sup><strong>`resguard` can also be used with async functions.</strong></sup>

## using tuples

resguard can also return a tuple with data and error values:

```javascript
import { resguard } from 'resguard';

async function fetchData() {
  const service = new DataService();
  const [[data, error]] = await resguard(service.getItems());

  if (error) {
    console.error("Error:", error);
    return;
  }

  return data;
}
```

## custom error handling

resguard supports custom error handling by allowing you to override the error type:

```javascript
import { resguard } from 'resguard';

class CustomError extends Error {}

async function fetchData() {
  const service = new DataService();
  const [[data, error]] = await resguard(service.getItems(), CustomError);

  if (error) {
    console.error("Custom Error:", error);
    return;
  }

  return data;
}
```


[npm-version-src]: https://img.shields.io/npm/v/resguard?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/resguard
[npm-downloads-src]: https://img.shields.io/npm/dm/resguard?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/resguard
[codecov-src]: https://img.shields.io/codecov/c/gh/henrycunh/resguard/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/henrycunh/resguard