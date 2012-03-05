
--------------------------------------------
To Do List, version 1.0, 2012-02-28

--------------------------------------------

An example of application built with Wakanda in some minutes.

There are two version of the application, one built with Wakanda version 1
and one built with version 2 (development channel). The later is a Single
Page APplication, using a tab widget. The version built with Wakanda v1
has two pages.


--------------------------------------------

Using the application

--------------------------------------------
* First, you need to create some users in the directory:
http://doc.wakanda.org/Wakanda-Studio0.Beta/help/Title/en/page2138.html

* Then you are ready! Just click the "Run project" button. Or you can
  "Start server", then open the index.html, and run it

* In the browser:
    1/ Login as an existing user
    2/ Click the "New" button
    3/ Enter some data (task title, priority level)
    4/ Click the "Save" button
    5/ Repeat steps 2-4 for each task
    6/ Now, say you're back later:
    		Click the "Complete" checkbox of a task
    		Click "Save"
    			=> The task is move to the "Completed" list
    7/ In the "Completed" tab, you'll find the task checked
       "completed"

Users can only see their own tasks. This is done by extending
the BaseToDoList class, and setting a restricting query to
automatically filter the user.

If you want to handle all the entities, you can write server-side
code.



--------------------------------------------

LICENSE

--------------------------------------------

This project is distributed under the MIT license.


Copyright (c) 2012 4D SAS


Permission is hereby granted, free of charge, to any person

obtaining a copy of this software and associated documentation

files (the "Software"), to deal in the Software without

restriction, including without limitation the rights to use,

copy, modify, merge, publish, distribute, sublicense, and/or sell

copies of the Software, and to permit persons to whom the

Software is furnished to do so, subject to the following


conditions:


The above copyright notice and this permission notice shall be

included in all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,

EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES

OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND

NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT

HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,

WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING

FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR

OTHER DEALINGS IN THE SOFTWARE.