import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPlayer, ITrainer, IUser } from '@avans-nx-workshop/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'avans-nx-workshop-user-detail',
  templateUrl: './user-detail.component.html',
  styles: [],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: (IPlayer | ITrainer) | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.subscription = this.userService.read(params['id']).subscribe((results) => {
        this.user = results;
      });
    });
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
      if(this.routeSub) this.routeSub.unsubscribe();
  }

  isTrainer(user: IPlayer | ITrainer): user is ITrainer {
    if(user == null) return false;
    return 'loan' in user;
  }
}
