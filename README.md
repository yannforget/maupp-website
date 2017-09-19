# MAUPP Website

http://maupp.ulb.ac.be

## Updating content

1. Install [Hugo](https://gohugo.io/getting-started/installing/)
2. Clone the repository: `git clone https://github.com/yannforget/maupp-website`
3. Live preview of the changes: `hugo serve`
4. Edit content with a text editor, or crate a pre-filled file content with: `hugo new <content-type>`
5. Close the live preview: `Ctrl+C`
6. Commit: `git add <files>`, `git commit -m "<message>"`
7. Push: `git push origin master`

## Media

Images can be added in the [/static/images/](/static/images/) folder, and can be accessed in markdown: `![My image](/images/my_image.png)`.

## Content type

* `page`: basic web page.
* `people`: person working on the project.
* `partner`: departement or institution working on the project.
* `news`: dated & authored news.

## Syntax

### Metadata block

For examples regarding the editing of the metadata block, see existing content in [/content/](/content/) or templates in [/archetypes/](/archetypes/).

### Content

* [Markdown syntax](https://daringfireball.net/projects/markdown/syntax)
* [Available markdown extensions](https://github.com/russross/blackfriday#extensions)
