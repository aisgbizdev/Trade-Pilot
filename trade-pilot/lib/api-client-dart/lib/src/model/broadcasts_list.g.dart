// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'broadcasts_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$BroadcastsList extends BroadcastsList {
  @override
  final BuiltList<Broadcast> broadcasts;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$BroadcastsList([void Function(BroadcastsListBuilder)? updates]) =>
      (BroadcastsListBuilder()..update(updates))._build();

  _$BroadcastsList._(
      {required this.broadcasts,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  BroadcastsList rebuild(void Function(BroadcastsListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  BroadcastsListBuilder toBuilder() => BroadcastsListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is BroadcastsList &&
        broadcasts == other.broadcasts &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, broadcasts.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'BroadcastsList')
          ..add('broadcasts', broadcasts)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class BroadcastsListBuilder
    implements Builder<BroadcastsList, BroadcastsListBuilder> {
  _$BroadcastsList? _$v;

  ListBuilder<Broadcast>? _broadcasts;
  ListBuilder<Broadcast> get broadcasts =>
      _$this._broadcasts ??= ListBuilder<Broadcast>();
  set broadcasts(ListBuilder<Broadcast>? broadcasts) =>
      _$this._broadcasts = broadcasts;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _page;
  int? get page => _$this._page;
  set page(int? page) => _$this._page = page;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  BroadcastsListBuilder() {
    BroadcastsList._defaults(this);
  }

  BroadcastsListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _broadcasts = $v.broadcasts.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(BroadcastsList other) {
    _$v = other as _$BroadcastsList;
  }

  @override
  void update(void Function(BroadcastsListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  BroadcastsList build() => _build();

  _$BroadcastsList _build() {
    _$BroadcastsList _$result;
    try {
      _$result = _$v ??
          _$BroadcastsList._(
            broadcasts: broadcasts.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'BroadcastsList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'BroadcastsList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'BroadcastsList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'broadcasts';
        broadcasts.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'BroadcastsList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
