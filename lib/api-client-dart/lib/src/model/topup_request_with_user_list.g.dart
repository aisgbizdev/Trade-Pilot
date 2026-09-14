// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_request_with_user_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupRequestWithUserList extends TopupRequestWithUserList {
  @override
  final BuiltList<TopupRequestWithUser> requests;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$TopupRequestWithUserList(
          [void Function(TopupRequestWithUserListBuilder)? updates]) =>
      (TopupRequestWithUserListBuilder()..update(updates))._build();

  _$TopupRequestWithUserList._(
      {required this.requests,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  TopupRequestWithUserList rebuild(
          void Function(TopupRequestWithUserListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupRequestWithUserListBuilder toBuilder() =>
      TopupRequestWithUserListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupRequestWithUserList &&
        requests == other.requests &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, requests.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupRequestWithUserList')
          ..add('requests', requests)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class TopupRequestWithUserListBuilder
    implements
        Builder<TopupRequestWithUserList, TopupRequestWithUserListBuilder> {
  _$TopupRequestWithUserList? _$v;

  ListBuilder<TopupRequestWithUser>? _requests;
  ListBuilder<TopupRequestWithUser> get requests =>
      _$this._requests ??= ListBuilder<TopupRequestWithUser>();
  set requests(ListBuilder<TopupRequestWithUser>? requests) =>
      _$this._requests = requests;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _page;
  int? get page => _$this._page;
  set page(int? page) => _$this._page = page;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  TopupRequestWithUserListBuilder() {
    TopupRequestWithUserList._defaults(this);
  }

  TopupRequestWithUserListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _requests = $v.requests.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupRequestWithUserList other) {
    _$v = other as _$TopupRequestWithUserList;
  }

  @override
  void update(void Function(TopupRequestWithUserListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupRequestWithUserList build() => _build();

  _$TopupRequestWithUserList _build() {
    _$TopupRequestWithUserList _$result;
    try {
      _$result = _$v ??
          _$TopupRequestWithUserList._(
            requests: requests.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'TopupRequestWithUserList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'TopupRequestWithUserList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'TopupRequestWithUserList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'requests';
        requests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TopupRequestWithUserList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
