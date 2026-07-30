# Components

The student portal reproduces the admin component system inside this repository;
it does not import admin runtime code.

Shared primitives own buttons, fields, textareas, filter shells, pagination,
empty states, toasts, dialogs, and skeletons. Feature components compose those
primitives and must not redefine shared dimensions.

The workspace shell, sidebar, top navigation, opportunity cards, filter layout,
and pagination match the admin equivalents. Student differences are limited to
copy, route targets, permissions, and student actions such as Apply or Cancel.
