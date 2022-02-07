# MF module template
This TypeScript based template is designed to get you up and running with a bunch of awesome front-end technologies.

The primary goal of this project is to provide a stable foundation upon which to build modern web applications. Its purpose is not to dictate your project structure or to demonstrate a complete real-world application, but to provide a set of tools intended to make front-end development robust, easy, and, most importantly, fun.

## Micro Frontends
Good frontend development is hard. Scaling frontend development so that many teams can work simultaneously on a large and complex product is even harder. In [this](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669) article we'll describe a recent trend of breaking up frontend monoliths into many smaller, more manageable pieces, and how this architecture can increase the effectiveness and efficiency of teams working on frontend code. As well as talking about the various benefits and costs, we'll cover some of the implementation options that are available, and we'll dive deep into a full example application that demonstrates the technique.

For a better understanding of the material please see this [course of lectures](https://www.youtube.com/playlist?list=PLNqp92_EXZBLr7p7hn6IYa1YPNs4yJ1t1) and [official documentation](https://webpack.js.org/concepts/module-federation/).

## Important notes
This template can be a bi-directional host (a webpack build that is both a host consuming remotes and a remote being consumed by other hosts).

The weak point of this architecture is the `remotes` that are served over the http/https protocol. If the `remote` is unavailable your application will break. Therefore, carefully withstand `remotes` and provide fallbacks.

Adhere to [10 npm Security Best Practices](https://snyk.io/blog/ten-npm-security-best-practices/).

All your npm packages from `dependencies` must be the same version across all you micro frontends repositories.

The exchange of global state between micro frontends repositories occurs with the help of [eventemitter3](https://github.com/primus/eventemitter3) (`useEventEmitter` hook) in the root repository.

Transpiling to ES5 is not really a good idea these days. Around [95% of browsers support ES2017](https://caniuse.com/async-functions,object-values,object-entries,mdn-javascript_builtins_object_getownpropertydescriptors,pad-start-end,mdn-javascript_grammar_trailing_commas_trailing_commas_in_functions) features, So transpiling to ES2017 should reduce bundle size by 10-15%. If there is need to support older browsers(like IE11) there could be two build one with ES5 and one with 2017. Because of 3% of users 97% of user experience should not be compromised.

## Installation
Install required node.js & npm.
```bash
"node": "16.13.2"
"npm": "8.3.2"
```

Create `.env` file on the root of the project.
```
MICRO_FRONTEND_HOST_NAME=MFModuleTemplate
MICRO_FRONTEND_HOST_URL=https://localhost:3001
MICRO_FRONTEND_HOST_PORT=3001

# set to true if need to be a bi-directional host
IS_MICRO_FRONTEND_REMOTE=false

# if IS_MICRO_FRONTEND_REMOTE=true
MICRO_FRONTEND_REMOTE_1_NAME=SomeRemote
MICRO_FRONTEND_REMOTE_1_URL=https://localhost:3002
MICRO_FRONTEND_REMOTE_1_PORT=3002
```

Install the project dependencies.
```bash
$ npm i
```

We recommend using the [Redux DevTools Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) and [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en). Using the chrome extension allows your monitors to run on a separate thread and affords better performance and functionality. It comes with several of the most popular monitors, is easy to configure, filters actions, and doesn't require installing any packages in your project.

## Running the Project
After completing the [installation](#installation) step, you're ready to start the project!

```bash
$ npm run start  # Start the development server
```

While developing, you will probably rely mostly on `npm run start` however, there are additional scripts at your disposal:

|`npm run <script>` |Description|
|-------------------|-----------|
|`build`            |Build prod app to ./build|
|`certificate`       |Create https certificate in ./webpack/ca|
|`lint:css`         |Lint the project for potential errors|
|`lint:css:fix`      |Lint the project and fixes all correctable errors|
|`lint:js`          |Lint the project for potential errors|
|`lint:js:fix`       |Lint the project and fixes all correctable errors|
|`start`            |Serve your dev app at `https://localhost:3001/`|
|`start:prod`       |Serve your prod app at `https://localhost:3001/`|
|`test`             |Run unit tests with Jest|
|`test:watch`       |Run `test` in watch mode to re-run tests when changed|
|`test:coverage`    |Generate information about coverage to ./coverage|

## Testing
To add a unit test, create a `.spec.tsx` or `.test.tsx` file anywhere inside of `./src`. Jest and webpack will automatically find these files.
