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

    const { data, error } = await resguard(client.getItems())
    if (error) 
        handle(error)
    
    const updated = await resguard(client.updateItems(data))
    if (updated.error) 
        handle(updated.error)

    return updated.data
}
```
<sup><strong>Both the `data` and `error` properties of the result are correctly typed</strong></sup>


```typescript
import { resguard } from 'resguard'

const result = resguard(() => {
    if (Math.random() > 0.5) 
        return true
    else 
        throw new Error('Something went wrong')
})

if (result.error) 
    handle(result.error)
```
<sup><strong>`resguard` can also be used with functions. When they are sync, the result also is!</strong></sup>

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


<table >
<tr>
<th><p><strong>❌ depressing</strong></p></th>
<th><p><strong>✅ awesome</strong></p></th>
</tr>
<tr>
<td>

```typescript
let result

try {
    result = await client.getItems()
} catch (error) {
    handle(error)
}
```
</td>
<td>

```typescript
const result = await resguard(client.getItems())
if (result.error) 
    handle(result.error)
```

</td>
</tr>
<tr><td></td><td></td></tr>
<tr>
<td>

```typescript
let result

try {
    result = await client.longRequest()
} catch (e: any) {
    const error: ClientError = e
    if (error.code === 'TIMEOUT')
      handleTimeout()
}
```

</td>
<td>

```typescript
const result = await resguard(client.longRequest(), ClientError)
if (result.error) {
    if (error.code === 'TIMEOUT')
      handleTimeout()
}
```

</td>
</tr>

<tr><td></td><td></td></tr>

<tr>
<td>

```typescript
let result
try {
  result = JSON.parse(data)
} catch (e: any) {
  const error: SyntaxError = e
  handle(error)
}
```

</td>
<td>

```typescript
const result = resguard(() => JSON.parse(data), SyntaxError)
if (result.error) 
    handle(result.error)
```

</td>
</tr>

<tr><td></td><td></td></tr>

<tr>
<td>

```typescript
let data: { test: number }

try {
  data = JSON.parse('{ test: 1 }')
} catch (e: any) {
  const error: SyntaxError = e
  handle(error)
}

console.log(data.test)
```

</td>
<td>

```typescript
const { data, error } = resguard<{ test: number}>(
    () => JSON.parse('{ test: 1 }'), 
    SyntaxError
)

if (error) 
    handle(error)

console.log(data.test)
```
</td>
</tr>

<tr><td></td><td></td></tr>

<tr>
<td>

```typescript
async function complexFunction() {
  let items
  try {
    items = await client.getItems()
  } catch (e: any) {
    const error: ClientError = e
    handle(error)
  }

  let updated
  try {
    updated = await client.updateItems(items)
  } catch (e: any) {
    const error: ClientError = e
    handle(error)
  }

  return updated
}
```

</td>
<td>

```typescript
async function complexFunction() {
  const items = await resguard(client.getItems(), ClientError)
  if (items.error) 
    handle(items.error)

  const updatedItems = await resguard(client.updateItems(items), ClientError)
  if (updatedItems.error) 
    handle(updatedItems.error)

  return updatedItems.data
}
```

</td>
</tr>

</table>


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
  const [[data, error]] = await resguard(() => throw new CustomError('damn!'), CustomError);

  if (error) {
    console.error("Custom Error:", error);
    console.log(error instanceof CustomError) // true
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