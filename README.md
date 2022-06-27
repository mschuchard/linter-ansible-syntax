
### Linter Ansible Syntax   [![Badge Status]][Travis]

*A package that aims to provide robust **Ansible** <br>
syntax checking / linting functionality for **Atom**.*

<br>

![Preview]

<br>

## Sunset Updates

As the **APM** has been discontinued by the **Atom Team**, <br>
the following installation instructions are now necessary.

1.  Navigate to your **Atom** package directory.

    `<home>/.atom/packages`
    
2.  Clone or **[Download]** this repository.
    
    ```shell
    git clone https://github.com/kdeldycke/meta-package-manager
    ```
    
3.  Place the retrieved code folder in the `packages` folder.

4.  Execute the following in the folder:

    ```shell
    npm install
    ```

<br>
<br>

## Project Status

This package is now in **Maintenance Mode**.

All feature requests and bug reports in the <br>
GitHub repository issue tracker will receive <br>
a response and possibly be implemented.

***Active development however, has ceased.***

<br>
<br>

## Requirements

- Ansible `2.0+`

- Atom Language-Ansible Package

- Atom Linter Package

<br>

## Usage

-   The Ansible syntax check only outputs the first error <br>
    it encounters, and therefore only the first error in a <br>
    playbook will be displayed.

-   Only works on playbooks.

    If your playbook contains roles and / or includes anywhere <br>
    in the playbook, then these will be checked as well.

-   To quickly and easily access issues in other files, you will <br>
    need to change the settings inside `Linter-UI-Default`

    For `Panel Represents` and / or `Statusbar Represents`, <br>
    you will need to change their options to `Entire Project`.
    
    This will allow you to use either display to quickly access <br>
    issues in other files by clicking on the displayed information.

<br>


<!----------------------------------------------------------------------------->

[Download]: https://github.com/kdeldycke/meta-package-manager/archive/refs/heads/main.zip
[Travis]: https://travis-ci.com/mschuchard/linter-ansible-syntax

[Preview]: resources/Preview.png


<!----------------------------------[ Badge ]---------------------------------->

[Badge Status]: https://travis-ci.com/mschuchard/linter-ansible-syntax.svg?branch=master