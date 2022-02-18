import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Link {
  id: number;
  title: string;
  url: string;
  fragment: string;
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  activeLinkId: number = 0;
  links: Link[] = [
    { id: 0, title: 'Anasayfa', url: 'public/home', fragment: 'one' },
    { id: 1, title: 'Giriş Yap', url: 'public/login', fragment: 'two' },
    { id: 2, title: 'Hata', url: 'public/error', fragment: 'three' },
  ];
  
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
  }

}
