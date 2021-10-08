for avy in *.gif; do
  file="${avy%.*}.png"
  if [ ! -f $file ]; then
    echo "Converting $avy to $file"
    ffmpeg -i $avy -vframes 1 -f image2 $file
  fi

  file="${avy%.*}.webp"
  if [ ! -f $file ]; then
    echo "Converting $avy to $file"
    ffmpeg -i $avy -vcodec webp -loop 0 -pix_fmt yuv420p $file
  fi
done

