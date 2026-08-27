// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_journal_entry_body_entry_price.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateJournalEntryBodyEntryPrice
    extends CreateJournalEntryBodyEntryPrice {
  @override
  final OneOf oneOf;

  factory _$CreateJournalEntryBodyEntryPrice(
          [void Function(CreateJournalEntryBodyEntryPriceBuilder)? updates]) =>
      (CreateJournalEntryBodyEntryPriceBuilder()..update(updates))._build();

  _$CreateJournalEntryBodyEntryPrice._({required this.oneOf}) : super._();
  @override
  CreateJournalEntryBodyEntryPrice rebuild(
          void Function(CreateJournalEntryBodyEntryPriceBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateJournalEntryBodyEntryPriceBuilder toBuilder() =>
      CreateJournalEntryBodyEntryPriceBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateJournalEntryBodyEntryPrice && oneOf == other.oneOf;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, oneOf.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateJournalEntryBodyEntryPrice')
          ..add('oneOf', oneOf))
        .toString();
  }
}

class CreateJournalEntryBodyEntryPriceBuilder
    implements
        Builder<CreateJournalEntryBodyEntryPrice,
            CreateJournalEntryBodyEntryPriceBuilder> {
  _$CreateJournalEntryBodyEntryPrice? _$v;

  OneOf? _oneOf;
  OneOf? get oneOf => _$this._oneOf;
  set oneOf(OneOf? oneOf) => _$this._oneOf = oneOf;

  CreateJournalEntryBodyEntryPriceBuilder() {
    CreateJournalEntryBodyEntryPrice._defaults(this);
  }

  CreateJournalEntryBodyEntryPriceBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _oneOf = $v.oneOf;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateJournalEntryBodyEntryPrice other) {
    _$v = other as _$CreateJournalEntryBodyEntryPrice;
  }

  @override
  void update(void Function(CreateJournalEntryBodyEntryPriceBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateJournalEntryBodyEntryPrice build() => _build();

  _$CreateJournalEntryBodyEntryPrice _build() {
    final _$result = _$v ??
        _$CreateJournalEntryBodyEntryPrice._(
          oneOf: BuiltValueNullFieldError.checkNotNull(
              oneOf, r'CreateJournalEntryBodyEntryPrice', 'oneOf'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
