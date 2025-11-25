import {Directive, ElementRef, inject, input, OnInit, signal} from '@angular/core';
import {getDownloadURL, ref} from 'firebase/storage';
import {FirebaseStorage} from '../tokens/firebase.tokens';
import {getPublicDownloadUrlMedia} from '../utils/get-public-download-url-media';

@Directive({
  selector: '[appFirebaseStorageSrc]',
  host: {
    '[class.firebase-storage-src--loading]': '_isLoading()'
  }
})
export class FirebaseStorageSrc implements OnInit {

  private readonly _elementRef = inject(ElementRef<HTMLImageElement>);
  private readonly _storage = inject(FirebaseStorage);
  protected _isLoading = signal(true);

  appFirebaseStorageSrc = input.required<string>();
  private = input<boolean>(false);

  ngOnInit() {

    const skillImgRef = ref(this._storage, this.appFirebaseStorageSrc());

    if (this.private()) {
      getDownloadURL(skillImgRef).then((url) => {
        this._elementRef.nativeElement.src = url;
        this._isLoading.set(false);
      });
    } else {
      this._elementRef.nativeElement.src = getPublicDownloadUrlMedia(this._storage, this.appFirebaseStorageSrc());
      this._isLoading.set(false);
    }
  }
}
