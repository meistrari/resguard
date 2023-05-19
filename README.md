# 🛡️ resguard

`resguard` is a lightweight and elegant package designed to simplify error handling and improve code readability when working with promises in TypeScript. It wraps promises and returns an object or tuple containing both data and error properties, streamlining the process of handling errors and accessing resolved data. resguard ensures that the correct types are returned, making your TypeScript code more robust.

## ✨ Features

- 🛡 Wraps promises and returns an object or tuple with data and error properties
- 🎯 TypeScript support with type checking
- 🛠️ Custom error handling support
- ⚡ Minimal dependencies and small bundle size

## 📦 Install

```bash
# Using npm
npm install resguard

# Using yarn
yarn add resguard

# Using pnpm
pnpm add resguard

# Using bun
bun i resguard
```

## 🚀 Usage

Here's a basic example of how to use resguard:

```javascript
import { resguard } from 'resguard';

async function fetchData() {
  const service = new DataService();
  const result = await resguard(service.getItems());

  if (result.error) {
    console.error("Error:", result.error);
    return;
  }

  return result.data;
}
```

In this example, `await resguard(service.getItems())` wraps the promise returned by `service.getItems()`. If there's an error, it's assigned to `result.error`, otherwise, the resolved data is stored in `result.data`. This makes it straightforward to handle errors and work with resolved data.

### 🧩 Using tuples

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

### 🎨 Custom error handling

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

## 🔬 Test Examples

Tests are written using the `vitest` testing framework. To understand how resguard works, you can refer to the tests file provided in the repository. This will give you a better understanding of the different use cases and how resguard handles promise results while maintaining correct types for TypeScript.

## 🌟 Contributing

Contributions, improvements, and suggestions are welcome! Feel free to open issues, submit pull requests, or reach out to the maintainers if you have any questions or need assistance.
