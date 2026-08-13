// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'users_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UsersList extends UsersList {
  @override
  final BuiltList<UserWithStats> users;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$UsersList([void Function(UsersListBuilder)? updates]) =>
      (UsersListBuilder()..update(updates))._build();

  _$UsersList._(
      {required this.users,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  UsersList rebuild(void Function(UsersListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UsersListBuilder toBuilder() => UsersListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UsersList &&
        users == other.users &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, users.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UsersList')
          ..add('users', users)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class UsersListBuilder implements Builder<UsersList, UsersListBuilder> {
  _$UsersList? _$v;

  ListBuilder<UserWithStats>? _users;
  ListBuilder<UserWithStats> get users =>
      _$this._users ??= ListBuilder<UserWithStats>();
  set users(ListBuilder<UserWithStats>? users) => _$this._users = users;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _page;
  int? get page => _$this._page;
  set page(int? page) => _$this._page = page;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  UsersListBuilder() {
    UsersList._defaults(this);
  }

  UsersListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _users = $v.users.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UsersList other) {
    _$v = other as _$UsersList;
  }

  @override
  void update(void Function(UsersListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UsersList build() => _build();

  _$UsersList _build() {
    _$UsersList _$result;
    try {
      _$result = _$v ??
          _$UsersList._(
            users: users.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'UsersList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'UsersList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'UsersList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'users';
        users.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UsersList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
