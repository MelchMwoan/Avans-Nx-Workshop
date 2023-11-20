import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'avans-nx-workshop-user-list',
  templateUrl: './user-list.component.html',
  styles: [],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: (IPlayer | ITrainer)[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
      this.subscription = this.userService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.users = results;
        document.getElementById("loading")?.classList.add("hidden");
      });
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
  }

  isTrainer(user: IPlayer | ITrainer): user is ITrainer {
    return 'loan' in user;
  }
}
