// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_request_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupRequestList extends TopupRequestList {
  @override
  final BuiltList<TopupRequest> requests;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$TopupRequestList(
          [void Function(TopupRequestListBuilder)? updates]) =>
      (TopupRequestListBuilder()..update(updates))._build();

  _$TopupRequestList._(
      {required this.requests,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  TopupRequestList rebuild(void Function(TopupRequestListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupRequestListBuilder toBuilder() =>
      TopupRequestListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupRequestList &&
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
    return (newBuiltValueToStringHelper(r'TopupRequestList')
          ..add('requests', requests)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class TopupRequestListBuilder
    implements Builder<TopupRequestList, TopupRequestListBuilder> {
  _$TopupRequestList? _$v;

  ListBuilder<TopupRequest>? _requests;
  ListBuilder<TopupRequest> get requests =>
      _$this._requests ??= ListBuilder<TopupRequest>();
  set requests(ListBuilder<TopupRequest>? requests) =>
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

  TopupRequestListBuilder() {
    TopupRequestList._defaults(this);
  }

  TopupRequestListBuilder get _$this {
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
  void replace(TopupRequestList other) {
    _$v = other as _$TopupRequestList;
  }

  @override
  void update(void Function(TopupRequestListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupRequestList build() => _build();

  _$TopupRequestList _build() {
    _$TopupRequestList _$result;
    try {
      _$result = _$v ??
          _$TopupRequestList._(
            requests: requests.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'TopupRequestList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'TopupRequestList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'TopupRequestList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'requests';
        requests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TopupRequestList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
