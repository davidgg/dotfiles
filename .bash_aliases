pending_hg(){
  (
  for dot_hg in `find -maxdepth 2 -mindepth 2 -type d -name ".hg" -exec echo "$PWD/{}/.." \;`
  do
    cd "$dot_hg" 
    hg out > /dev/null 2>&1
    h_out=$? 
    hg in > /dev/null 2>&1 
    h_in=$? 
    tput setaf 2
    (test $h_out == 0 || test $h_in == 0) && tput setaf 1
    test $h_out == 255 && tput setaf 3 
    basename $PWD
    tput sgr0
    test $h_out == 0  && echo "pending out"
    test $h_in == 0 && echo "pending in"
    test $h_out == 255 && echo "no default repo"
    echo
  done
  )
}


function serve {
  python -m SimpleHTTPServer
}

hg_prompt(){
  /usr/bin/env hg log -r . --template ' (hg {branch}:{bookmarks}) ' 2> /dev/null | sed 's/\:)/)/'
}

