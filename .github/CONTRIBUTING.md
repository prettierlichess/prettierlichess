# Contributing

## General information

Thank you for planning to work on this project and thank you for reading this summary!

If you want to make very big changes, please ask if these changes will be included by opening either an issue or a draft pull request. This way we can make sure that you don't have unnecessary work.
If you want to be assigned to an open issue, feel free to ask.

If you would like to contribute and have questions or need help, feel free to ping someone from the [team](https://github.com/prettierlichess/prettierlichess/blob/master/.github/CODEOWNERS) in an issue or pull request.

It is very helpful if you use screenshots of the changes you made in your pull request. This makes it easier for the reviewer to understand where your changes are important.

Please always remain friendly.

## Code Standards

-   Use tabs for the CSS files
-   Use `!important` at the end of each CSS rule to ensure that the default style is overridden
-   Try to choose CSS selectors that are clear but not unnecessarily complicated. Several parent nodes of the element you are looking for can and (most of the time) should be included, but for example, it would be unnecessary to start every selector with `#main-wrap`. For most elements, however, selectors already exist that can be used as an example.

## Structure of the extension

### Style change

The styles.css file is injected when lichess is called and thus contains all the style changes that prettierlichess makes. The default styling of lichess is overwritten.

The colours set by the user are transferred to the file by variables. The variables are:
`--primaryColor`, `--backgroundColor`, `--surfaceColor`, `--surfaceColorHover`, `--secondaryColor`, `--tertiaryColor`, `--defaultWhite`, `--textColor`, `--arrowPrimary`, `--arrowSecondary`, `--arrowTertiary`, `--arrowAlternate`, `--lastMove`, `--preMove`, `--moveIndicator`, `--boardDark`, `--boardLight`, `--coordDark`, `--coordLight`

The variables are then used with

```css
var(--variable)
```

in the CSS rules. For example:

```css
color: var(--primaryColor) !important;
```

There is also an RGB version for each variable. Like this the colours can also be used with a certain opacity. It contains the RGB values of the set colours.
Usage:

```css
background-color: rgba(var(--primaryColorRGB), 0.8) !important;
```

### Popup

The popup consists of an HTML, a CSS and a js file. These make it possible for the user to select the individual colours. The color pickers are created with the [pickr library from Simonwep](https://github.com/Simonwep/pickr).

### Colour combinations

When applying colours through the extension, it must be noted that these can be changed by the user. This means that not all colours that are different in the standard setting can be used for elements that lie on top of each other.

There are no fixed rules for the colour combinations, but it makes sense to use colour combinations that are already used elsewhere in order to have the greatest possible contrast.

### Dark and light background

The extension is primarily developed for use with dark background. However, the idea is that as many elements as possible are restyled. This also applies if they already look good with dark background by default.

Therefore, contributions that improve the white background in particular are appreciated too.

## Build and test workflow

Execute this command for the setup to get all packages:

```
npm install
```

### Build

During the build, the output files from webpack are placed in the `.dist/` folder. There are two ways to start this process. For a single build, run:

```
npm run build
```

To rebuild automatically when changes are made, run:

```
npm run watch
```

### Include the extension into the browser

#### Chrome

-   Go to the `chrome://extensions` page.
-   Enable the developer mode.
-   Disable the official Prettierlichess version.
-   Click _Load unpacked extension_
-   Navigate to the `.dist/` folder and include the extension.

#### Firefox

-   Go to the `about:addons` page.
-   Disable the official Prettierlichess version.
-   Go to the `about:debugging#addons` page.
-   Click _Load Temporary Add-on_
-   Navigate to the `.dist/manifest.json` file and include the extension.

### Testing

After you have made your changes, check that the feature you have implemented works by navigating to the changed lichess page.
If possible, feel free to test for both Firefox and Chrome. If this is not possible, please write in your PR on which platform you tested.

## Testing the popup

### Testing with http-server

It is possible to run the popup on a local http server as a stand-alone website, making it easier to edit and test. The functionality for this is implemented in the `/testing` folder. There you will find a script that can start the http server. This requires a built version of the extension in the `/dist` folder. Then the script can be started with

```
npm run popup:run --port=PORT
```

on the port `PORT` (default 8000).
There is also a mock script that is passed to the server to mock all Chrome API calls and sustain the functionality of the popup.

### Automated testing with cypress

To test the functionality of the popup automatically, [Cypress](https://github.com/cypress-io/cypress) is used as well. The automated test system also relies on the http server concept.

The concrete test cases are located in the `/cypress/e2e` folder and test as many of the popup's and extension's features as possible.

To run the tests locally you can either open the Cypress test suite (this is necessary for the extension tests) with

```
npm run cy:open
```

or run the tests in headless mode (Firefox and Chrome) with

```
npm run test:popup
```

In this case, both the build of the current source and the server startup and shutdown are done completely automatically.

In addition, Cypress is also tested automatically on every push event with Github Actions:
[![E2E tests](https://github.com/prettierlichess/prettierlichess/actions/workflows/e2e-testing.yaml/badge.svg?event=push)](https://github.com/prettierlichess/prettierlichess/actions/workflows/e2e-testing.yaml)

## Linting

### General

For automatic code formatting, [prettier](https://prettier.io/) is used. [Husky](https://github.com/typicode/husky) adds it as a pre-commit hook. This automatically formats the code before each commit.
If problems occur with the formatter, commits can also be executed without a hook by using `--no-verify` as a flag on the command line. In principle, however, the formatter should always be used.

Code formatting is limited to CSS, JS, TS, HTML in `src/` and to Markdown and JS in the main folder.
To start the formatting, use:

```
npm run format:fix
```

or to check the formatting:

```
npm run format:check
```

### web-ext lint

Web-ext is a command line tool from Mozilla that makes it easier to create browser extensions. It is used for linting in this project. To run the linting, navigate to the `src` folder and run `web-ext lint`. This tool should be available directly from the command line after `npm install`.
The tool will then print out any problems or vulnerabilities.

Note that web-ext is designed for Firefox, but the extension is designed for both Chrome and Firefox. This may cause messages about unsupported APIs to be displayed, which can simply be ignored.

### Github Actions

[![Format Code](https://github.com/prettierlichess/prettierlichess/actions/workflows/formatter.yaml/badge.svg?event=push)](https://github.com/prettierlichess/prettierlichess/actions/workflows/formatter.yaml) [![Run web-ext lint](https://github.com/prettierlichess/prettierlichess/actions/workflows/web-ext.yaml/badge.svg?event=push)](https://github.com/prettierlichess/prettierlichess/actions/workflows/web-ext.yaml)

The formatter is also connected to Github Actions. This checks for each push and pull request whether the formatting is correct with `npm run formatter:check`.

Also web-ext lint is executed for both source and build for each push and PR. The action is only sensitive to errors. Warning level messages are displayed but do not cause the action to fail.

## Debug output

The extension consists mainly of CSS, but for some features (like the "enable vertical layout" button) JS is used. To better understand a bug with such features, there is a debug output with `console.debug()`.

### Read debug output

#### Chrome

-   Go to lichess.
-   Press _F12_ to display the developer tools.
-   Go to the _Console_ tab.
-   In the dropdown next to _Filter_, select only _Verbose_.
-   Go to the lichess page where the bug occurs.
-   Read the debug output.

#### Firefox

-   Go to lichess.
-   Press _F12_ to display the developer tools.
-   Go to the _Console_ tab.
-   In the dropdown next to the filter, activate only _Debug_.
-   Go to the lichess page where the bug occurs.
-   Read the debug output.

<hr>

That is basically all. If you still have questions, feel free to open an issue.
