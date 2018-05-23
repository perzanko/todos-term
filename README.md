![.todos](logo.png?raw=true)

todos-term
=========

** Probably the best way to keep your mind clean and well organized. **

** .todos ** is simple task manager directed to developers teams. Super fast and easy to use. Well structured JSON stored in the root of every project.

## Getting Started

1. First install it by npm/yarn

```
npm i -g todos-term
```

2. Then go to the project folder and create .todos

```
cd my-project-folder
todos create
```

3. Now you can add your first todo

```
todos add
```

## Usage

```go
> HELP
CREATE       [create, crt, cr] - Create your own .todos list and keep it locally in your directory.
LIST         [list, lst, ls, l] - Display table with .todos.
ADD          [add, ad, a] - Add .todos item to the list.
REMOVE       [remove, rem, rm, r] - Remove .todos item from the list.
STATUS       [status, stat, st, s] - Change status of .todos single item.
EDIT         [edit, ed, e] - Edit single .todos item.
CLEAR        [clear, clr, cl, c] - Clear all .todos items with status 'DONE'.
HELP         [help, h, -h] - Show help tips.
GLOBAL       [...-g] - You can manage your own .todos global as well.
```

