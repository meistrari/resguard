# 🛡️ resguard

`resguard` is a lightweight and elegant package designed to simplify error handling and improve code readability when working with promises in TypeScript. It wraps promises and returns in an object or tuple containing both data and error properties, streamlining the process of handling errors and accessing resolved data. `resguard` ensures that the correct types are returned, making your TypeScript code more robust.

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
<sup>Both the `data` and `error` properties of the result are correctly typed</sup>

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
<sup>`resguard` can also be used with functions.</sup>

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
<sup>`resguard` can also be used with async functions.</sup>

### using tuples

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

### custom error handling

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

