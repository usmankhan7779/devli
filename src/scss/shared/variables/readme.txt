#1
File with variables in shared/variables folder can be imported to any angular component's scss,
so you can use variables to style your components.
For example if you want something has primary color you don't have to copy #0275d8, just use:
"color: $brand-primary;"

#2
When changing variable please don't remove native value:
Just comment it out. That will help to change it again when needed.

Example:
//$blue:   #0275d8 !default;
$blue:   #01afed !default;

#3
Don't add own variables to bootstrap variables file, because it's a copy of bootstrap's native file.
To customize bootstrap components use: scss/bootstrap-customization/_variables.scss
To Add global variables for entire project use: scss/shared/variables/_project.scss
