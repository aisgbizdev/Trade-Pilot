// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_amount_breakdown_entry.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupAmountBreakdownEntry extends TopupAmountBreakdownEntry {
  @override
  final int amountRupiah;
  @override
  final int count;

  factory _$TopupAmountBreakdownEntry(
          [void Function(TopupAmountBreakdownEntryBuilder)? updates]) =>
      (TopupAmountBreakdownEntryBuilder()..update(updates))._build();

  _$TopupAmountBreakdownEntry._(
      {required this.amountRupiah, required this.count})
      : super._();
  @override
  TopupAmountBreakdownEntry rebuild(
          void Function(TopupAmountBreakdownEntryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupAmountBreakdownEntryBuilder toBuilder() =>
      TopupAmountBreakdownEntryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupAmountBreakdownEntry &&
        amountRupiah == other.amountRupiah &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupAmountBreakdownEntry')
          ..add('amountRupiah', amountRupiah)
          ..add('count', count))
        .toString();
  }
}

class TopupAmountBreakdownEntryBuilder
    implements
        Builder<TopupAmountBreakdownEntry, TopupAmountBreakdownEntryBuilder> {
  _$TopupAmountBreakdownEntry? _$v;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  TopupAmountBreakdownEntryBuilder() {
    TopupAmountBreakdownEntry._defaults(this);
  }

  TopupAmountBreakdownEntryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupAmountBreakdownEntry other) {
    _$v = other as _$TopupAmountBreakdownEntry;
  }

  @override
  void update(void Function(TopupAmountBreakdownEntryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupAmountBreakdownEntry build() => _build();

  _$TopupAmountBreakdownEntry _build() {
    final _$result = _$v ??
        _$TopupAmountBreakdownEntry._(
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'TopupAmountBreakdownEntry', 'amountRupiah'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'TopupAmountBreakdownEntry', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
