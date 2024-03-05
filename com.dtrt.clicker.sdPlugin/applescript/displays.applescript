use AppleScript version "2.4" -- Yosemite (10.10) or later
use framework "Foundation"
use framework "AppKit"
use scripting additions

-- Function to flatten a nested list
on flattenList(theList) -- non-recursive
script U
  property flattenedList : theList
  property interimFlattenedList : missing value
end script
--=U
repeat while (count U's flattenedList's lists) > 0
  set U's interimFlattenedList to {}
  repeat with currItem in U's flattenedList
    if (class of currItem) = list then
      set U's interimFlattenedList to U's interimFlattenedList & currItem's contents
    else
      set end of U's interimFlattenedList to currItem's contents
    end if
  end repeat
  set U's flattenedList to U's interimFlattenedList
end repeat
return U's flattenedList
end flattenList

set allFrames to (current application's NSScreen's screens()'s valueForKey:"frame") as list

flattenList(allFrames)
